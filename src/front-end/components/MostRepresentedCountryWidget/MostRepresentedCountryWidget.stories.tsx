import type { Meta, StoryObj } from '@storybook/react-vite';
import MostRepresentedCountryWidget from './MostRepresentedCountryWidget';

const meta = {
  title: 'Dashboard/Pays le plus représenté',
  component: MostRepresentedCountryWidget,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    countryName: {
      description: 'Nom du pays fourni par les données agrégées du catalogue.',
      control: 'text',
    },
    movieCount: {
      description:
        'Nombre de films distincts associés à ce pays, calculé en amont.',
      control: 'number',
    },
  },
} satisfies Meta<typeof MostRepresentedCountryWidget>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Nominal: Story = {
  args: {
    state: 'success',
    countryName: 'United States of America',
    movieCount: 725,
  },
};

export const LongCountryName: Story = {
  args: {
    state: 'success',
    countryName: 'Democratic Republic of the Congo',
    movieCount: 18,
  },
};

export const Loading: Story = {
  args: { state: 'loading' },
};

export const NoKnownCountries: Story = {
  args: { state: 'empty' },
};

export const Error: Story = {
  args: { state: 'error' },
};
