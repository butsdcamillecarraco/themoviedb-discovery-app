import type { Meta, StoryObj } from '@storybook/react-vite';
import WeightedBestRatedGenreWidget from './WeightedBestRatedGenreWidget';

const meta = {
  title: 'Dashboard/Meilleure note pondérée par genre',
  component: WeightedBestRatedGenreWidget,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'La note est calculée en amont avec WR = (v / (v + m)) × R + (m / (v + m)) × C. R est la moyenne simple des notes valides du genre, v le nombre de films notés du genre, C la moyenne simple des notes valides du catalogue et m = 5. Une note est valide entre 0 et 10 avec au moins un vote; un genre est éligible à partir de cinq films notés. Le widget affiche le résultat fourni et ne calcule ni ne classe les genres.',
      },
    },
  },
  argTypes: {
    genreName: {
      description: 'Genre ayant le meilleur résultat pondéré fourni.',
      control: 'text',
    },
    weightedRating: {
      description:
        'Résultat pré-calculé de la formule bayésienne documentée dans les propriétés.',
      control: 'number',
    },
  },
} satisfies Meta<typeof WeightedBestRatedGenreWidget>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Nominal: Story = {
  args: {
    state: 'success',
    genreName: 'Animation',
    weightedRating: 7.68,
  },
};

export const NoEligibleGenre: Story = {
  args: { state: 'empty' },
};

export const LongGenreName: Story = {
  args: {
    state: 'success',
    genreName: 'Science-fiction et aventures spatiales',
    weightedRating: 7.68,
  },
};

export const Loading: Story = {
  args: { state: 'loading' },
};

export const Unavailable: Story = {
  args: { state: 'unavailable' },
};

export const Error: Story = {
  args: { state: 'error' },
};
