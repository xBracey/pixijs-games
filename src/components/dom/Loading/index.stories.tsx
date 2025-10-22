import Loading from './index';
import type { Meta, StoryObj } from '@storybook/react';

export default {
    title: 'Components/Loading',
    component: Loading,
    decorators: [
        (Story) => (
            <div className="w-full h-full flex justify-center items-center bg-black p-8">
                <Story />
            </div>
        )
    ]
} as Meta<typeof Loading>;

type Story = StoryObj<typeof Loading>;

export const Primary: Story = {
    args: {}
};
