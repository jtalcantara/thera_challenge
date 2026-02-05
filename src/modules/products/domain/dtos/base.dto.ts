import { IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, Min, MinLength } from "class-validator";
import { Type } from "class-transformer";

export class ProductDTO {
    id!: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    @MinLength(3)
    name!: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    @MinLength(3)
    category!: string;

    @IsString()
    @MaxLength(255)
    @MinLength(3)
    @IsOptional()
    description!: string;

    @Type(() => Number)
    @IsNumber({ allowNaN: false, allowInfinity: false })
    @IsNotEmpty()
    @Min(0)
    price!: number;

    @Type(() => Number)
    @IsNumber({ allowNaN: false, allowInfinity: false })
    @IsNotEmpty()
    @Min(0)
    quantity!: number;

    createdAt!: Date;

    updatedAt!: Date;
};