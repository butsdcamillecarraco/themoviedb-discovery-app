import type { Meta, StoryObj } from '@storybook/react-vite';
import BestRatedGenreWidget from './BestRatedGenreWidget';

const meta = {
  title: 'Dashboard/Meilleure note par genre',
  component: BestRatedGenreWidget,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    genreName: {
      description: 'Nom du genre ayant la meilleure moyenne simple fournie.',
      control: 'text',
    },
    averageRating: {
      description:
        'Moyenne arithmétique simple des notes valides du genre, sur 10; non pondérée.',
      control: 'number',
    },
  },
} satisfies Meta<typeof BestRatedGenreWidget>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Nominal: Story = {
  args: { state: 'success', genreName: 'Animation', averageRating: 7.41 },
};

export const NoValidRatings: Story = {
  args: { state: 'empty' },
};

export const LongGenreName: Story = {
  args: {
    state: 'success',
    genreName: 'Science-fiction et aventures spatiales',
    averageRating: 7.41,
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
