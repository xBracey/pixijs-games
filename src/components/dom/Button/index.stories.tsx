import Button from './index';
import type { Meta, StoryObj } from '@storybook/react';

export default {
    title: 'Components/Button',
    component: Button
} as Meta<typeof Button>;

type Story = StoryObj<typeof Button>;

export const Primary: Story = {
    args: {
        children: 'Button'
    }
};
