import type { Meta, StoryObj } from '@storybook/react-vite';
import MoviesInDatabaseWidget from './MoviesInDatabaseWidget';

const meta = {
  title: 'Dashboard/Films en base',
  component: MoviesInDatabaseWidget,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof MoviesInDatabaseWidget>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Loading: Story = {
  args: { state: 'loading' },
};

export const Empty: Story = {
  args: { state: 'empty' },
};

export const Loaded: Story = {
  args: { state: 'success', count: 1250 },
};

export const Error: Story = {
  args: { state: 'error' },
};

export const Unavailable: Story = {
  args: { state: 'unavailable' },
};
