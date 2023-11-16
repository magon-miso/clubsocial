import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { SocioEntity } from "../socio/socio.entity";

@Entity()
export class ClubEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;
 
    @Column()
    description: string;
 
    @Column()
    image: string;

    @Column({ type: 'date' })
    foundationDate: string

    @ManyToMany(() => SocioEntity, (socio) => socio.clubes)
    @JoinTable()
    socios: SocioEntity[];
}
