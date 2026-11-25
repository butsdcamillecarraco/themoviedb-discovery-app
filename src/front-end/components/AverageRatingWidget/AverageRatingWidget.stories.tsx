import type { Meta, StoryObj } from '@storybook/react-vite';
import AverageRatingWidget from './AverageRatingWidget';

const meta = {
  title: 'Dashboard/Note moyenne',
  component: AverageRatingWidget,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    averageRating: {
      description:
        'Moyenne simple des notes de tout le catalogue, fournie sur une échelle de 0 à 10.',
      control: 'number',
    },
  },
} satisfies Meta<typeof AverageRatingWidget>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Nominal: Story = {
  args: { state: 'success', averageRating: 6.78 },
};

export const Loading: Story = {
  args: { state: 'loading' },
};

export const NoScores: Story = {
  args: { state: 'empty' },
};

export const Error: Story = {
  args: { state: 'error' },
};
