import type { Meta, StoryObj } from '@storybook/react-vite';
import DominantGenreWidget from './DominantGenreWidget';

const meta = {
  title: 'Dashboard/Genre dominant',
  component: DominantGenreWidget,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    genreName: {
      description: 'Nom du genre fourni par les données agrégées du catalogue.',
      control: 'text',
    },
    movieCount: {
      description: 'Nombre de films distincts associés à ce genre.',
      control: 'number',
    },
  },
} satisfies Meta<typeof DominantGenreWidget>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Nominal: Story = {
  args: { state: 'success', genreName: 'Drame', movieCount: 322 },
};

export const LongGenreName: Story = {
  args: {
    state: 'success',
    genreName: 'Science-fiction et aventures spatiales',
    movieCount: 28,
  },
};

export const NoKnownGenre: Story = {
  args: { state: 'empty' },
};

export const Loading: Story = {
  args: { state: 'loading' },
};

export const Error: Story = {
  args: { state: 'error' },
};
