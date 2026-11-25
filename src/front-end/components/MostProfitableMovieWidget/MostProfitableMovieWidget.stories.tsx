import type { Meta, StoryObj } from '@storybook/react-vite';
import MostProfitableMovieWidget from './MostProfitableMovieWidget';

const meta = {
  title: 'Dashboard/Film le plus rentable',
  component: MostProfitableMovieWidget,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    movie: {
      description:
        'Résultat pré-calculé. Le ROI en pourcentage doit suivre la formule documentée dans les props.',
    },
  },
} satisfies Meta<typeof MostProfitableMovieWidget>;

export default meta;
type Story = StoryObj<typeof meta>;

const profitableMovie = {
  title: 'The Shawshank Redemption',
  releaseYear: 1994,
  roiPercentage: 69667.36,
  posterUrl: 'https://image.tmdb.org/t/p/w185/9cqNxx0GxF0bflZmeSMuL5tnGzr.jpg',
};

export const Nominal: Story = {
  args: { state: 'success', movie: profitableMovie },
};

export const MissingPoster: Story = {
  args: {
    state: 'success',
    movie: { ...profitableMovie, posterUrl: null },
  },
};

export const UnknownROI: Story = {
  args: {
    state: 'success',
    movie: { ...profitableMovie, roiPercentage: null },
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
