import { PickType } from "@nestjs/mapped-types";
import { UserModel } from "src/users/entities/user.entity";

export class RegisterUserDto extends PickType(UserModel, ['email','nickname','password']){}