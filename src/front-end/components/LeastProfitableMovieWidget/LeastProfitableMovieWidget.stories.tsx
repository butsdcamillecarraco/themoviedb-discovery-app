import type { Meta, StoryObj } from '@storybook/react-vite';
import LeastProfitableMovieWidget from './LeastProfitableMovieWidget';

const meta = {
  title: 'Dashboard/Film le moins rentable',
  component: LeastProfitableMovieWidget,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    movie: {
      description:
        'Résultat pré-calculé. Le ROI en pourcentage suit la formule documentée dans les propriétés.',
    },
  },
} satisfies Meta<typeof LeastProfitableMovieWidget>;

export default meta;
type Story = StoryObj<typeof meta>;

const leastProfitableMovie = {
  title: 'Example Movie',
  releaseYear: 2020,
  roiPercentage: -100,
  posterUrl: 'https://image.tmdb.org/t/p/w185/9cqNxx0GxF0bflZmeSMuL5tnGzr.jpg',
};

export const Nominal: Story = {
  args: { state: 'success', movie: leastProfitableMovie },
};

export const ZeroROI: Story = {
  args: {
    state: 'success',
    movie: { ...leastProfitableMovie, roiPercentage: 0 },
  },
};

export const UnknownROI: Story = {
  args: {
    state: 'success',
    movie: { ...leastProfitableMovie, roiPercentage: null },
  },
};

export const MissingPoster: Story = {
  args: {
    state: 'success',
    movie: { ...leastProfitableMovie, posterUrl: null },
  },
};

export const NoEligibleMovie: Story = {
  args: { state: 'empty' },
};

export const EligibilityRulesUnvalidated: Story = {
  args: { state: 'unavailable' },
};

export const Loading: Story = {
  args: { state: 'loading' },
};

export const Error: Story = {
  args: { state: 'error' },
};
