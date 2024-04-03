import { Exclude } from "class-transformer";
import { IsArray, IsBoolean, IsNotEmpty, IsOptional } from "class-validator";
import { PageDto } from "../page.dto";

export class CreateRoleDto {
    @IsNotEmpty({ message: '角色编码不能为空' })
    code: string;

    @IsNotEmpty({ message: '角色名不能为空' })
    name: string;

    @IsOptional()
    @IsArray()
    permissionIds: string[];

    @IsBoolean()
    @IsOptional()
    enable?: boolean;
}

export class UpdateRoleDto extends CreateRoleDto {

    @Exclude()
    code: string;
}

export class PageRoleDto extends PageDto {
    @IsOptional()
    name: string;

    @IsOptional()
    code: string;

    @IsBoolean()
    @IsOptional()
    enable: boolean;
}