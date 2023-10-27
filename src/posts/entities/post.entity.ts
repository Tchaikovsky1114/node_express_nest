import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";



@Entity() // 테이블로 변환됨
export class PostModel {

  
  // 프라이머리
  @PrimaryGeneratedColumn()
  id: number;

  // 테이블의 칼럼 생성
  @Column()
  author: string;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column()
  likeCount: number;

  @Column()
  commentCount: number;

}