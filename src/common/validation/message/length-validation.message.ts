import { ValidationArguments } from "class-validator";


export const lengthValidationMessage = (args:ValidationArguments) => {
  if(args.constraints.length === 2) {
    return `${args.property}는 ${args.constraints[0]} ~ ${args.constraints[1]}글자여야 합니다.`
  } else {
    return `${args.property}는 최소 ${args.constraints[0]}글자여야 합니다.`
  }

}