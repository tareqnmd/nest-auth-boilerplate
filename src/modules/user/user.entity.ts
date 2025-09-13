import { Exclude } from 'class-transformer';
import { DefaultEntity } from 'src/common/entities/default.entity';
import { Column, Entity, Unique } from 'typeorm';
import { UserRole } from './enum/user-role.enum';

@Entity({
  name: 'users',
})
@Unique(['email'])
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
    length: 255,
    nullable: true,
  })
  @Exclude()
  password?: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    nullable: false,
    default: UserRole.USER,
  })
  role: UserRole;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  image?: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  @Exclude()
  googleId?: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  @Exclude()
  githubId?: string;
}
