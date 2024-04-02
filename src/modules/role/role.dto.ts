import { Exclude } from "class-transformer";
import { IsArray, IsBoolean, IsNotEmpty, IsOptional } from "class-validator";

export class createRoleDto {
    @IsNotEmpty({ message: '角色编码不能为空' })
    code: string;

    @IsNotEmpty({ message: '角色名不能为空' })
    name: string;

    @IsOptional()
    @IsArray()
    permissionIds: number[];

    @IsBoolean()
    @IsOptional()
    enable?: boolean;
}

export class updtaeRoleDto extends createRoleDto {

    @Exclude()
    code: string;
}