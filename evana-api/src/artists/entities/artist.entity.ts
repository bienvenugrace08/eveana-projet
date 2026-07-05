import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ArtistGenre } from './artist-genre.entity';

@Entity('artists')
export class Artist {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 150 })
  name: string;

  @Column({ type: 'text' })
  bio: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  image: string | null;

  // Relation 1-N normalisée : chaque genre musical est une ligne distincte
  @OneToMany(() => ArtistGenre, (genre) => genre.artist, {
    cascade: true,
    eager: true,
  })
  genres: ArtistGenre[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
