import type { Meta, StoryObj } from '@storybook/react-vite';
import AverageDurationWidget from './AverageDurationWidget';

const meta = {
  title: 'Dashboard/Durée moyenne',
  component: AverageDurationWidget,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    averageMinutes: {
      description:
        'Moyenne calculée à partir des durées valides du catalogue, en minutes.',
      control: 'number',
    },
  },
} satisfies Meta<typeof AverageDurationWidget>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Nominal: Story = {
  args: { state: 'success', averageMinutes: 107 },
};

export const Loading: Story = {
  args: { state: 'loading' },
};

export const NoData: Story = {
  args: { state: 'empty' },
};

export const Error: Story = {
  args: { state: 'error' },
};
