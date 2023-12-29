import React from 'react';
import { Input } from '../CustomInput';
import { Button } from '../Button';
import { FaArrowRight } from 'react-icons/fa';

interface iNewsLettersProps {
    // Define your props here
}

const NewsLetters: React.FC<iNewsLettersProps> = () => {
    return (
        <div className="w-full h-72 bg-[#5959d9] flex flex-col gap-y-10 rounded-sm text-main-white px-28 py-10">

        <div className="flex flex-col gap-y-2">
            <h2 className="text-xl font-semibold">Yes!</h2>
            <p className="font-medium">
                Send me exclusive offers, unique gift ideas,
                and personalized<br /> tips for shopping and
                selling on Commerce.
            </p>
        </div>

        <form className="flex flex-col gap-y-4 self-center w-[648px]">
            <Input.Root className="pl-5">
                <Input.Input placeholder="Drop Your Email" name='email'/>

                <Button.Root hasbg className="py-2 px-5">
                    <Button.Text text="Subscribe" />
                    <Button.Icon icon={FaArrowRight} />
                </Button.Root>
            </Input.Root>
            <p className="text-center underline">First order only, you're ready?</p>
        </form>

    </div>
    );
};

export default NewsLetters;
