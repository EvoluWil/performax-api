import { ArrayMinSize, IsArray, IsLatLong, IsString } from 'class-validator';

export class UpdateAttendanceLocations {
  @IsArray()
  @IsString({ each: true })
  @IsLatLong({ each: true })
  @ArrayMinSize(1)
  attendanceLocations: string[];
}
