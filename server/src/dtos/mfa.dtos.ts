export interface VerifyMfaDto {
  token: string;
}

export interface DisableMfaDto {
  password: string; // optional extra security check
}