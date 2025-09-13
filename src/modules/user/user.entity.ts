import { Exclude } from 'class-transformer';
import { DefaultEntity } from 'src/common/entities/default.entity';
import { Column } from 'typeorm';
import { UserRole } from './enum/user-role.enum';

export class UserEntity extends DefaultEntity {
  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  firstName: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  lastName: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  email: string;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: false,
  })
  @Exclude()
  password?: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    nullable: false,
  })
  role: UserRole;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  image?: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  @Exclude()
  googleId?: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  @Exclude()
  githubId?: string;
}
