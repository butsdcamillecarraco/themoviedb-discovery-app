import type { Meta, StoryObj } from '@storybook/react-vite';
import MostPopularMovieWidget from './MostPopularMovieWidget';

const meta = {
  title: 'Dashboard/Film le plus populaire',
  component: MostPopularMovieWidget,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    movie: {
      description:
        'Film déjà sélectionné dans le catalogue; popularité est un indice, pas une note.',
    },
  },
} satisfies Meta<typeof MostPopularMovieWidget>;

export default meta;
type Story = StoryObj<typeof meta>;

const popularMovie = {
  title: 'The Shawshank Redemption',
  releaseYear: 1994,
  popularity: 1036.49,
  posterUrl: 'https://image.tmdb.org/t/p/w185/9cqNxx0GxF0bflZmeSMuL5tnGzr.jpg',
};

export const Nominal: Story = {
  args: { state: 'success', movie: popularMovie },
};

export const MissingPoster: Story = {
  args: {
    state: 'success',
    movie: { ...popularMovie, posterUrl: null },
  },
};

export const UnknownPopularity: Story = {
  args: {
    state: 'success',
    movie: { ...popularMovie, popularity: null },
  },
};

export const LongTitle: Story = {
  args: {
    state: 'success',
    movie: {
      ...popularMovie,
      title:
        'A Very Long Demonstration Movie Title That Must Remain Readable on Small Screens',
      releaseYear: null,
    },
  },
};

export const Loading: Story = {
  args: { state: 'loading' },
};

export const Empty: Story = {
  args: { state: 'empty' },
};

export const Error: Story = {
  args: { state: 'error' },
};
