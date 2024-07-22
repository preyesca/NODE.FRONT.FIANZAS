import { ELanguage } from './helpers/enums/language.enum';

export class AppConsts {
  static readonly DEFAULT = {
    settings: {
      language: ELanguage.SPANISH,
      components: {
        table: {
          Limit: 10,
          ItemsPorPage: [10, 25, 50, 100],
        },
      },
    },
    pagination: {
      limit: 5,
      search: '',
      table: {
        itemsPorPage: [10, 25, 50, 100],
        itemsPorPageCustom: [5],
      },
    },
  };

  static readonly FORMAT = {
    DATE: 'DD-MM-YYYY',
    DATETIME: 'DD-MM-YYYY HH:mm:ss',
    CURRENCY: {
      SYMBOL: '$',
      SYMBOL_START: true, //Start: $ 18.60, false: 13.26 $
      FORMAT: '00.00',
    },
  };

  static readonly PATTERN = {
    EMAIL_ADDRESS: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.(com|org|net|edu|gov|global|mx)$/,
    ONLY_NUMBERS: /^[0-9]$/,
    ONLY_LETTERS: /^[a-zA-ZáéíóúñÁÉÍÓÚÑ]+$/,
    ONLY_LETTERS_WITH_SPACES: /^[a-zA-Z áÁéÉíÍóÓúÚñÑ]+$/,
    ALPHANUMERIC: /^[a-zA-Z0-9 áéíóúñÁÉÍÓÚÑ]+$/,
    ALPHANUMERIC_WITH_CHARACTERS: /^[a-záéíóúñÁÉÍÓÚÑA-Z0-9.,\s-]+$/,
  };

  static readonly FILE = {
    EXTENSION_VALID: '.PNG,.PDF,.TIF,.TIFF,.JPG,.JPEG,.XLSX',
    EXTENSION_VALID_CONFIRM_SEND:
      '.PNG,.PDF,.TIF,.TIFF,.JPG,.JPEG,.XLSX,.MSG,.EML',
    EXTENSION_VALID_COTEJO: 'PDF, JPG, JPEG, PNG',

  };

}
