import type { Meta, StoryObj } from '@storybook/react-vite';
import RepresentedGenresWidget from './RepresentedGenresWidget';

const meta = {
  title: 'Dashboard/Genres représentés',
  component: RepresentedGenresWidget,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    genreCount: {
      description:
        'Nombre de genres distincts du catalogue, calculé en amont des associations film-genre.',
      control: 'number',
    },
  },
} satisfies Meta<typeof RepresentedGenresWidget>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Nominal: Story = {
  args: { state: 'success', genreCount: 19 },
};

export const ZeroGenres: Story = {
  args: { state: 'success', genreCount: 0 },
};

export const Unavailable: Story = {
  args: { state: 'unavailable' },
};

export const Loading: Story = {
  args: { state: 'loading' },
};

export const Error: Story = {
  args: { state: 'error' },
};
