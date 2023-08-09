import * as bcrypt from "bcrypt";

export class Password {
  static toHash(password: string) {
    const salt = bcrypt.genSaltSync(12);
    const hash = bcrypt.hashSync(password, salt);
    return hash;
  }
  static compare(storedPassword: string, suppliedPassword: string) {
    return bcrypt.compareSync(storedPassword, suppliedPassword);
  }
}
