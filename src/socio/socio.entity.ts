import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ClubEntity } from "../club/club.entity";

@Entity()
export class SocioEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    username: string;
 
    @Column()
    email: string;
 
    @Column({ type: 'date' })
    birthdate: string

    @ManyToMany(() => ClubEntity, (club) => club.socios)
    clubes: ClubEntity[];
}
