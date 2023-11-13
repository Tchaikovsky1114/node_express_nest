import { PostModel } from "../entities/post.entity";
import { PickType } from "@nestjs/mapped-types";

// Pick, Omit, Partial ... => 유틸은 타입을 반환
// PickType, OmitType, PartialType ... => 유틸+'Type'은 값을 반환

export class CreatePostDto extends PickType(PostModel,['title','content']) {}