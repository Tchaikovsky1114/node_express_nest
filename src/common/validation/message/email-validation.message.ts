import { ValidationArguments } from "class-validator";

export const emailValidationMessage = (args:ValidationArguments) => {
  return `${args.property}에 이메일 형식이 올바르지 않습니다.`
}