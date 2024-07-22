export class DataValidator {
  static hasData(value: string | undefined | null): boolean {
    return !(
      !value ||
      value.trim() === '' ||
      value.trim().toLowerCase() === 'null'
    );
  }

  static hasDataNumber(value: number | undefined | null): boolean {
    return !(!value || value === 0 || isNaN(value));
  }

  static isAlphanumeric(value: string | undefined | null): boolean {
    if (!value) return false;
    return /^[a-zA-Z0-9]+$/.test(value);
  }
}
