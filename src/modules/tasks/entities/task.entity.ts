import { UserEntity } from 'src/modules/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class TaskEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  deadline: Date;

  @Column()
  userId: number;

  @ManyToOne(() => UserEntity, (u) => u.tasks)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;
}
