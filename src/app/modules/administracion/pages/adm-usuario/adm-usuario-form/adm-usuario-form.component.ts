import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ICatalogo } from 'src/app/modules/catalogos/helpers/interfaces/catalogo';
import { ICatalogoPais } from 'src/app/modules/catalogos/helpers/interfaces/catalogo-pais';
import { AppConsts } from 'src/app/shared/AppConsts';
import { EFormAction } from 'src/app/shared/helpers/enums/form-action.enum';
import { IResponse } from 'src/app/shared/helpers/interfaces/response';
import { NotifierService } from 'src/app/shared/services/notification/notifier.service';
import { SwalService } from 'src/app/shared/services/notification/swal.service';
import { DataValidator } from 'src/app/shared/validators/data.validator';
import { FormActionValidator } from 'src/app/shared/validators/form-action.validator';
import { IUserStorageUserDto } from '../../../../../shared/helpers/interfaces/storage/user-storage.interface';
import { UserStorageService } from '../../../../../shared/services/storage/user-storage.service';
import { IProyectoCodigo } from '../../../helpers/interfaces/adm-proyecto';
import {
  IUsuario,
  IUsuarioEdit,
  IUsuarioGetCatalogs,
  IUsuarioProject,
} from '../../../helpers/interfaces/adm-usuario';
import { AdmUsuarioService } from '../../../services/adm-usuario.service';

@Component({
  selector: 'app-admin-usuarios-form',
  templateUrl: './adm-usuario-form.component.html',
})
export class AdmUsuarioFormComponent implements OnInit, AfterViewInit {
  @ViewChild('inputNombre') inputNombre!: ElementRef;

  frmUsuario: FormGroup = <FormGroup>{};

  action!: EFormAction;
  title: string = 'Nuevo';

  breadcrumbs: string[] = [
    'administracion.title',
    'administracion.usuario.titlePlural',
  ];

  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = ['pais', 'proyecto', 'perfiles'];

  projects: Array<IUsuarioProject> = [];
  projectEdit: any = null;
  userInfo!: IUserStorageUserDto;

  currentUserId: string | null = null;
  currentCountry: ICatalogoPais | undefined = undefined;
  paises: Array<ICatalogoPais> = [];
  estatus: Array<ICatalogo> = [];
  perfiles: Array<ICatalogo> = [];
  proyectos: IProyectoCodigo[] = [];
  proyectosByPais: IProyectoCodigo[] = [];

  constructor(
    private readonly swal: SwalService,
    private readonly notifierService: NotifierService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private usuarioService: AdmUsuarioService,
    private userStorageService: UserStorageService
  ) {
    this.userInfo = this.userStorageService.getCurrentUserInfo();
  }

  ngOnInit(): void {
    this.initForm();
    this.checkActivatedRoute();

    this.dataSource.data = this.projects;
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.inputNombre.nativeElement?.focus();
    }, 100);
  }

  initForm(): void {
    this.frmUsuario = this.formBuilder.group({
      nombre: [
        '',
        [
          Validators.required,
          Validators.pattern(AppConsts.PATTERN.ONLY_LETTERS_WITH_SPACES),
        ],
      ],
      primerApellido: [
        '',
        [
          Validators.required,
          Validators.pattern(AppConsts.PATTERN.ONLY_LETTERS_WITH_SPACES),
        ],
      ],
      segundoApellido: [
        '',
        [Validators.pattern(AppConsts.PATTERN.ONLY_LETTERS_WITH_SPACES)],
      ],
      correoElectronico: [
        '',
        [
          Validators.required,
          Validators.pattern(AppConsts.PATTERN.EMAIL_ADDRESS),
        ],
      ],
      pais: [0 /* [Validators.required, Validators.min(1)] */],
      proyecto: ['' /* [Validators.required, Validators.minLength(8)] */],
      perfil: [0 /* [Validators.required, Validators.min(1)] */],
      estatus: [0, [Validators.required]],
    });

    this.frmUsuario.controls['pais'].valueChanges.subscribe(
      (clave) =>
        (this.currentCountry = this.paises.find((p) => p.clave == clave))
    );
  }

  checkActivatedRoute(): void {
    this.activatedRoute.params.subscribe((p) => {
      const result = FormActionValidator.checkRoute(
        this.activatedRoute.snapshot.routeConfig?.path,
        p['id']
      );

      if (!result) {
        this.router.navigateByUrl(`/administracion/usuarios`);
        return;
      }

      this.currentUserId = result.id;
      this.action = result.action;
      this.breadcrumbs.push(result.breadcrumb);

      this.title =
        result.action === EFormAction.CREATE
          ? 'administracion.usuario.form.titles.create'
          : result.action === EFormAction.UPDATE
          ? 'administracion.usuario.form.titles.edit'
          : 'administracion.usuario.form.titles.view';

      this.title != 'administracion.usuario.form.titles.view' &&
        this.displayedColumns.push('acciones');
      this.checkActionAndLoad(this.currentUserId);
    });
  }

  checkActionAndLoad(_id: string | null): void {
    if (_id) {
      if (this.action === EFormAction.VIEW) this.frmUsuario.disable();
      this.usuarioService.getByIdAndGetCatalogosToEdit(_id).subscribe({
        next: (response: IResponse<IUsuarioEdit>) => {
          if (response.success) {
            const { usuario, catalogos } = response.data;
            this.paises = catalogos.paises;
            this.estatus = catalogos.estatus;
            this.perfiles = catalogos.perfiles;
            this.proyectos = catalogos.proyectos;
            this.proyectosByPais = catalogos.proyectosByPais;
            // load projects by user
            this.projects = usuario.proyectos;
            this.dataSource.data = this.projects;

            this.frmUsuario.patchValue(usuario);
          } else this.notifierService.error(response.message, 'Error');
        },
        error: (err) => {
          this.return();
          this.notifierService.error(err?.error?.message);
        },
      });
    } else {
      this.usuarioService.getCatalogs().subscribe({
        next: (response: IResponse<IUsuarioGetCatalogs>) => {
          if (response.success) {
            this.paises = response.data.paises;
            this.estatus = response.data.estatus;
            this.perfiles = response.data.perfiles;
            this.proyectos = response.data.proyectos;
          } else this.notifierService.error(response.message, 'Error');
        },
        error: (err) => {
          this.return();
          this.notifierService.error(err?.error?.message);
        },
      });
    }
  }

  onPaisSelectionChange(clave: number): void {
    this.frmUsuario.controls['proyecto'].setValue(null);
    this.proyectosByPais = this.proyectos.filter((p) => p.pais === clave);
  }

  onCheckToAddProject(): boolean {
    const { pais, proyecto, perfil } = this.frmUsuario.value;

    if (!pais || !proyecto || !perfil) return false;
    if (Array.isArray(perfil) && perfil.length == 0) return false;
    return true;
  }

  onAddOrUpdateProject(): void {
    const { pais, proyecto, perfil } = this.frmUsuario.value;
    if (!this.projectEdit) {
      this.projects.push({
        pais,
        proyecto,
        perfiles: perfil,
      });
    } else {
      const index = this.projects.findIndex(
        (p) => p.proyecto == this.projectEdit.proyecto
      );

      this.projects[index].pais = pais;
      this.projects[index].proyecto = proyecto;
      this.projects[index].perfiles = perfil;
    }

    this.frmUsuario.reset({
      ...this.frmUsuario.value,
      pais: 0,
      proyecto: '',
      perfil: 0,
    });
    this.proyectosByPais = [];

    this.dataSource.data = this.projects;
    this.projectEdit = null;
  }

  onDeleteProject(id: string): void {
    this.projects = this.projects.filter((p) => p.proyecto !== id);
    this.dataSource.data = this.projects;

    if (this.projectEdit) {
      this.frmUsuario.reset({
        ...this.frmUsuario.value,
        pais: 0,
        proyecto: '',
        perfil: 0,
      });
      this.proyectosByPais = [];

      this.projectEdit = null;
    }
  }

  onLoadDataProject(row: any): void {
    this.projectEdit = row;
    const { pais, proyecto, perfiles } = row;

    this.proyectosByPais = this.proyectos.filter((p) => p.pais === pais);
    this.frmUsuario.controls['pais'].setValue(pais);
    this.frmUsuario.controls['proyecto'].setValue(proyecto);
    this.frmUsuario.controls['perfil'].setValue(perfiles);
  }

  onCancelEditProject(): void {
    this.frmUsuario.reset({
      ...this.frmUsuario.value,
      pais: 0,
      proyecto: '',
      perfil: 0,
    });
    this.proyectosByPais = [];

    this.projectEdit = null;
  }

  onCheckProjectWasAdded(id: string): boolean {
    for (let p of this.projects) {
      if (id == p.proyecto) return true;
    }
    return false;
  }

  getCountryByCode(clave: number): string {
    const country = this.paises.find((p) => p.clave == clave);
    return country ? country.descripcion : '';
  }

  getCountryFlagByCode(clave: number): string {
    const country = this.paises.find((p) => p.clave == clave);
    return country?.icon || '';
  }

  getProjectById(id: string): string {
    const project = this.proyectos.find((p) => p._id == id);
    return project ? project.codigo : '';
  }

  getProfilesByCode(claves: number[]): string {
    let profiles: string[] = [];

    for (let clave of claves) {
      const profile = this.perfiles.find((p) => p.clave == clave);
      if (profile) profiles.push(profile.descripcion);
    }
    return profiles.join(', ');
  }

  submit(): void {
    if (this.action === EFormAction.VIEW) return;

    if (this.frmUsuario.invalid || this.projects.length < 1) {
      this.frmUsuario.markAllAsTouched();
      return;
    }

    const {
      nombre,
      primerApellido,
      segundoApellido,
      correoElectronico,
      estatus,
    } = this.frmUsuario.value;
    const jsonUser = {
      nombre,
      primerApellido,
      segundoApellido,
      correoElectronico,
      estatus,
      proyectos: this.projects.map((p) => {
        return {
          proyecto: p.proyecto,
          pais: p.pais,
          perfiles: p.perfiles,
        };
      }),
    };
    let user: IUsuario = <IUsuario>jsonUser;

    if (!DataValidator.hasData(user.segundoApellido))
      user.segundoApellido = undefined;

    if (this.currentUserId) {
      if (user.estatus == 1) user = { ...user, intentos: 0 };
      this.usuarioService.update(this.currentUserId, user).subscribe({
        next: (response: IResponse<IUsuario>) => {
          if (response.success) {
            this.return();
            this.notifierService.success(response.message);
          } else this.notifierService.error(response.message, 'Error');
        },
        error: (err) => this.notifierService.error(err?.error?.message),
      });
    } else {
      this.usuarioService.create(user).subscribe({
        next: (response: IResponse<IUsuario>) => {
          if (response.success) {
            this.return();
            this.notifierService.success(response.message);
          } else this.notifierService.error(response.message, 'Error');
        },
        error: (err) => this.notifierService.error(err?.error?.message),
      });
    }
  }

  return(): void {
    this.router.navigateByUrl(`/administracion/usuarios`);
  }
}
