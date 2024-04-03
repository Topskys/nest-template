import { PermissionType } from "@/types";
import { PartialType } from "@nestjs/mapped-types";
import { Exclude } from "class-transformer";
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreatePermissionDto {
    @IsString()
    @IsNotEmpty({ message: '名称不能为空' })
    title: string;

    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsNotEmpty({ message: '标识不能为空' })
    code: string;

    @IsString()
    @IsNotEmpty({ message: '类型不能为空' })
    type: PermissionType;

    @IsString()
    @IsOptional()
    parentId?: string;

    @IsString()
    @IsOptional()
    path?: string;

    @IsString()
    @IsOptional()
    component?: string;

    @IsString()
    @IsOptional()
    redirect?: string;

    @IsString()
    @IsOptional()
    icon?: string;

    @IsNumber()
    @IsOptional()
    order?: number;

    @IsBoolean()
    @IsOptional()
    noCache?: boolean;

    @IsString()
    @IsOptional()
    description: string;

    @IsBoolean()
    @IsOptional()
    hidden?: boolean;

    @IsBoolean()
    @IsOptional()
    affix?: boolean;

    @IsBoolean()
    @IsOptional()
    isFrame?: boolean;

    @IsBoolean()
    @IsOptional()
    isLink?: boolean;

    @IsString()
    @IsOptional()
    link_url?: string;

    @IsBoolean()
    @IsOptional()
    alwaysShow?: boolean;

    @IsString()
    @IsOptional()
    activeMenu?: string;

    @IsBoolean()
    @IsOptional()
    enable?: boolean;
}

export class UpdatePermissionDto extends PartialType(CreatePermissionDto) {
    @Exclude()  // 忽略效验菜单类型
    type: PermissionType;
}