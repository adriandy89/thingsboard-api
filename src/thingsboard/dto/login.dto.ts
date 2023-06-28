import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    type: String,
    nullable: false,
  })
  @IsNotEmpty()
  readonly username: string;

  @ApiProperty({
    type: String,
    nullable: false,
  })
  @IsNotEmpty()
  readonly password: string;
}
