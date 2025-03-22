import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Character } from '@prisma/client';

// Form validation schema
const characterSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  race: z.string().min(1, 'Race is required'),
  class: z.string().min(1, 'Class is required'),
  level: z.coerce.number().int().min(1).max(20),
  strength: z.coerce.number().int().min(1).max(30),
  dexterity: z.coerce.number().int().min(1).max(30),
  constitution: z.coerce.number().int().min(1).max(30),
  intelligence: z.coerce.number().int().min(1).max(30),
  wisdom: z.coerce.number().int().min(1).max(30),
  charisma: z.coerce.number().int().min(1).max(30),
  hitPoints: z.coerce.number().int().min(1),
  maxHitPoints: z.coerce.number().int().min(1),
  armorClass: z.coerce.number().int().min(1),
  background: z.string().optional(),
  alignment: z.string().optional(),
  experience: z.coerce.number().int().min(0).optional(),
  proficiencies: z.string().optional(),
  equipment: z.string().optional(),
  spells: z.string().optional(),
  features: z.string().optional(),
  notes: z.string().optional(),
});

export type CharacterFormValues = z.infer<typeof characterSchema>;

interface CharacterFormProps {
  character?: Character;
  onSubmit: (data: CharacterFormValues) => Promise<void>;
  isLoading?: boolean;
}

/**
 * Character form component for creating and editing characters
 */
export function CharacterForm({ character, onSubmit, isLoading = false }: CharacterFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CharacterFormValues>({
    resolver: zodResolver(characterSchema),
    defaultValues: character ? {
      ...character,
      proficiencies: character.proficiencies || '',
      equipment: character.equipment || '',
      spells: character.spells || '',
      features: character.features || '',
    } : {
      name: '',
      race: '',
      class: '',
      level: 1,
      strength: 10,
      dexterity: 10,
      constitution: 10,
      intelligence: 10,
      wisdom: 10,
      charisma: 10,
      hitPoints: 10,
      maxHitPoints: 10,
      armorClass: 10,
      experience: 0,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">
            Character Name
          </label>
          <Input
            id="name"
            placeholder="Character Name"
            {...register('name')}
            error={errors.name?.message}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="race" className="text-sm font-medium">
            Race
          </label>
          <Input
            id="race"
            placeholder="e.g., Human, Elf, Dwarf"
            {...register('race')}
            error={errors.race?.message}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="class" className="text-sm font-medium">
            Class
          </label>
          <Input
            id="class"
            placeholder="e.g., Fighter, Wizard, Rogue"
            {...register('class')}
            error={errors.class?.message}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="level" className="text-sm font-medium">
            Level
          </label>
          <Input
            id="level"
            type="number"
            min={1}
            max={20}
            {...register('level')}
            error={errors.level?.message}
          />
        </div>
      </div>

      <div className="border-t pt-4">
        <h3 className="text-lg font-medium mb-4">Ability Scores</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label htmlFor="strength" className="text-sm font-medium">
              Strength
            </label>
            <Input
              id="strength"
              type="number"
              min={1}
              max={30}
              {...register('strength')}
              error={errors.strength?.message}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="dexterity" className="text-sm font-medium">
              Dexterity
            </label>
            <Input
              id="dexterity"
              type="number"
              min={1}
              max={30}
              {...register('dexterity')}
              error={errors.dexterity?.message}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="constitution" className="text-sm font-medium">
              Constitution
            </label>
            <Input
              id="constitution"
              type="number"
              min={1}
              max={30}
              {...register('constitution')}
              error={errors.constitution?.message}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="intelligence" className="text-sm font-medium">
              Intelligence
            </label>
            <Input
              id="intelligence"
              type="number"
              min={1}
              max={30}
              {...register('intelligence')}
              error={errors.intelligence?.message}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="wisdom" className="text-sm font-medium">
              Wisdom
            </label>
            <Input
              id="wisdom"
              type="number"
              min={1}
              max={30}
              {...register('wisdom')}
              error={errors.wisdom?.message}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="charisma" className="text-sm font-medium">
              Charisma
            </label>
            <Input
              id="charisma"
              type="number"
              min={1}
              max={30}
              {...register('charisma')}
              error={errors.charisma?.message}
            />
          </div>
        </div>
      </div>

      <div className="border-t pt-4">
        <h3 className="text-lg font-medium mb-4">Combat Stats</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label htmlFor="hitPoints" className="text-sm font-medium">
              Current HP
            </label>
            <Input
              id="hitPoints"
              type="number"
              min={0}
              {...register('hitPoints')}
              error={errors.hitPoints?.message}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="maxHitPoints" className="text-sm font-medium">
              Max HP
            </label>
            <Input
              id="maxHitPoints"
              type="number"
              min={1}
              {...register('maxHitPoints')}
              error={errors.maxHitPoints?.message}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="armorClass" className="text-sm font-medium">
              Armor Class
            </label>
            <Input
              id="armorClass"
              type="number"
              min={1}
              {...register('armorClass')}
              error={errors.armorClass?.message}
            />
          </div>
        </div>
      </div>

      <div className="border-t pt-4">
        <h3 className="text-lg font-medium mb-4">Additional Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="background" className="text-sm font-medium">
              Background
            </label>
            <Input
              id="background"
              placeholder="Character Background"
              {...register('background')}
              error={errors.background?.message}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="alignment" className="text-sm font-medium">
              Alignment
            </label>
            <Input
              id="alignment"
              placeholder="e.g., Lawful Good, Chaotic Neutral"
              {...register('alignment')}
              error={errors.alignment?.message}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="experience" className="text-sm font-medium">
              Experience Points
            </label>
            <Input
              id="experience"
              type="number"
              min={0}
              {...register('experience')}
              error={errors.experience?.message}
            />
          </div>
        </div>
      </div>

      <div className="border-t pt-4">
        <h3 className="text-lg font-medium mb-4">Features & Equipment</h3>
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <label htmlFor="proficiencies" className="text-sm font-medium">
              Proficiencies
            </label>
            <textarea
              id="proficiencies"
              className="w-full min-h-[100px] rounded-md border border-input p-3 text-sm"
              placeholder="List proficiencies (weapons, tools, skills, etc.)"
              {...register('proficiencies')}
            />
            {errors.proficiencies && (
              <p className="text-sm text-red-500">{errors.proficiencies.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="equipment" className="text-sm font-medium">
              Equipment
            </label>
            <textarea
              id="equipment"
              className="w-full min-h-[100px] rounded-md border border-input p-3 text-sm"
              placeholder="List equipment and items"
              {...register('equipment')}
            />
            {errors.equipment && (
              <p className="text-sm text-red-500">{errors.equipment.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="spells" className="text-sm font-medium">
              Spells
            </label>
            <textarea
              id="spells"
              className="w-full min-h-[100px] rounded-md border border-input p-3 text-sm"
              placeholder="List spells (if applicable)"
              {...register('spells')}
            />
            {errors.spells && (
              <p className="text-sm text-red-500">{errors.spells.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="features" className="text-sm font-medium">
              Features & Traits
            </label>
            <textarea
              id="features"
              className="w-full min-h-[100px] rounded-md border border-input p-3 text-sm"
              placeholder="List class features, racial traits, etc."
              {...register('features')}
            />
            {errors.features && (
              <p className="text-sm text-red-500">{errors.features.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="notes" className="text-sm font-medium">
              Notes
            </label>
            <textarea
              id="notes"
              className="w-full min-h-[100px] rounded-md border border-input p-3 text-sm"
              placeholder="Additional notes about your character"
              {...register('notes')}
            />
            {errors.notes && (
              <p className="text-sm text-red-500">{errors.notes.message}</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" isLoading={isLoading}>
          {character ? 'Update Character' : 'Create Character'}
        </Button>
      </div>
    </form>
  );
}