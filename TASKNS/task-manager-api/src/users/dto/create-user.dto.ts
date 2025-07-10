import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '../../common/decorators/roles.decorator';

export class CreateUserDto {
  @ApiProperty({ description: 'User full name' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'User email address' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'User password', minLength: 6 })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @ApiPropertyOptional({ 
    description: 'User role (admin or user)', 
    enum: UserRole,
    default: UserRole.USER 
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
} 