import type { Meta, StoryObj } from '@storybook/react-vite';
import BestRatedMovieWidget from './BestRatedMovieWidget';

const meta = {
  title: 'Dashboard/Film le mieux noté',
  component: BestRatedMovieWidget,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    movie: {
      description:
        'Film déjà sélectionné comme mieux noté dans tout le catalogue.',
    },
  },
} satisfies Meta<typeof BestRatedMovieWidget>;

export default meta;
type Story = StoryObj<typeof meta>;

const ratedMovie = {
  title: 'The Shawshank Redemption',
  releaseYear: 1994,
  rating: 9.1,
  posterUrl: 'https://image.tmdb.org/t/p/w185/9cqNxx0GxF0bflZmeSMuL5tnGzr.jpg',
};

export const Nominal: Story = {
  args: { state: 'success', movie: ratedMovie },
};

export const MissingPoster: Story = {
  args: {
    state: 'success',
    movie: { ...ratedMovie, posterUrl: null },
  },
};

export const LongTitleAndUnknownYear: Story = {
  args: {
    state: 'success',
    movie: {
      ...ratedMovie,
      title:
        'A Very Long Demonstration Movie Title That Must Remain Readable on Small Screens',
      releaseYear: null,
    },
  },
};

export const Loading: Story = {
  args: { state: 'loading' },
};

export const NoRatedMovie: Story = {
  args: { state: 'empty' },
};

export const Error: Story = {
  args: { state: 'error' },
};
