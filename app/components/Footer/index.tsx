import { GoArrowUp } from "react-icons/go";
import Logo from "../Logo";
import { Button } from "../Button";

const Footer = () => {
    return (
        <footer className="w-full h-auto flex flex-col gap-y-10">
            <div className="flex justify-center py-3 bg-base-graybackground">
                <p className={`text-center`}>N I  S H O P, is powered 100% by @wivulo dev.</p>
            </div>

            <div className="flex px-4 justify-between">
                <div className="flex flex-col basis-1/5 gap-y-6">
                    <Logo />

                    <div className="text-sm">
                        <p>Benguela, Angola</p>
                        <p>Av. 1º de Maio, 123</p>
                    </div>

                    <div className="flex w-[60%] gap-x-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                            <path d="M0 16C0 24.8366 7.16344 32 16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16Z" fill="#1877F2" />
                            <path d="M24 16C24 11.6 20.4 8 16 8C11.6 8 8 11.6 8 16C8 20 10.9 23.3 14.7 23.9V18.3H12.7V16H14.7V14.2C14.7 12.2 15.9 11.1 17.7 11.1C18.6 11.1 19.5 11.3 19.5 11.3V13.3H18.5C17.5 13.3 17.2 13.9 17.2 14.5V16H19.4L19 18.3H17.1V24C21.1 23.4 24 20 24 16Z" fill="white" />
                        </svg>

                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                            <path d="M0 16C0 24.8366 7.16344 32 16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16Z" fill="#1DA1F2" />
                            <path d="M24 11C23.4 11.3 22.8 11.4 22.1 11.5C22.8 11.1 23.3 10.5 23.5 9.7C22.9 10.1 22.2 10.3 21.4 10.5C20.8 9.9 19.9 9.5 19 9.5C16.9 9.5 15.3 11.5 15.8 13.5C13.1 13.4 10.7 12.1 9 10.1C8.1 11.6 8.6 13.5 10 14.5C9.5 14.5 9 14.3 8.5 14.1C8.5 15.6 9.6 17 11.1 17.4C10.6 17.5 10.1 17.6 9.6 17.5C10 18.8 11.2 19.8 12.7 19.8C11.5 20.7 9.7 21.2 8 21C9.5 21.9 11.2 22.5 13 22.5C19.1 22.5 22.5 17.4 22.3 12.7C23 12.3 23.6 11.7 24 11Z" fill="white" />
                        </svg>
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                            <path d="M0 16C0 24.8366 7.16344 32 16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16Z" fill="#2867B2" />
                            <path d="M11.6 24H8.2V13.3H11.6V24ZM9.9 11.8C8.8 11.8 8 11 8 9.9C8 8.8 8.9 8 9.9 8C11 8 11.8 8.8 11.8 9.9C11.8 11 11 11.8 9.9 11.8ZM24 24H20.6V18.2C20.6 16.5 19.9 16 18.9 16C17.9 16 16.9 16.8 16.9 18.3V24H13.5V13.3H16.7V14.8C17 14.1 18.2 13 19.9 13C21.8 13 23.8 14.1 23.8 17.4V24H24Z" fill="white" />
                        </svg>

                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                            <path d="M0 16C0 24.8366 7.16344 32 16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16Z" fill="#EA4C89" />
                            <path d="M16 8C11.584 8 8 11.584 8 16C8 20.416 11.584 24 16 24C20.4 24 24 20.416 24 16C24 11.584 20.4 8 16 8ZM21.28 11.68C22.24 12.848 22.8 14.32 22.832 15.936C22.608 15.888 20.352 15.44 18.08 15.712C18.032 15.6 17.984 15.472 17.936 15.36C17.792 15.024 17.648 14.688 17.488 14.368C19.984 13.36 21.136 11.872 21.28 11.68ZM16 9.184C17.728 9.184 19.328 9.84 20.528 10.896C20.4 11.072 19.376 12.448 16.944 13.36C15.824 11.296 14.576 9.616 14.4 9.36C14.912 9.248 15.44 9.184 16 9.184ZM13.088 9.824C13.264 10.064 14.48 11.76 15.616 13.776C12.416 14.624 9.6 14.608 9.296 14.608C9.76 12.48 11.184 10.72 13.088 9.824ZM9.168 16.016C9.168 15.952 9.168 15.872 9.168 15.808C9.456 15.824 12.784 15.856 16.192 14.832C16.384 15.216 16.576 15.6 16.752 16C16.672 16.032 16.576 16.048 16.48 16.08C12.96 17.216 11.088 20.32 10.928 20.576C9.824 19.36 9.168 17.76 9.168 16.016ZM16 22.832C14.416 22.832 12.96 22.288 11.808 21.392C11.936 21.136 13.312 18.464 17.168 17.12C17.184 17.104 17.2 17.104 17.216 17.104C18.176 19.6 18.576 21.68 18.672 22.288C17.856 22.64 16.944 22.832 16 22.832ZM19.808 21.664C19.744 21.248 19.376 19.248 18.48 16.8C20.624 16.464 22.496 17.024 22.736 17.088C22.432 18.992 21.344 20.64 19.808 21.664Z" fill="white" />
                        </svg>
                    </div>
                </div>
                <div className="flex basis-3/5">
                    <div className="basis-1/4 flex flex-col">
                        <p className="mb-[1.6rem] font-semibold text-base text-text-2">Shop</p>

                        <div>
                            <ul className="flex flex-col gap-y-3 text-text-6 text-sm">
                                <li>Gift cards</li>
                                <li>Site map</li>
                                <li>Polka blog</li>
                                <li>Login</li>
                                <li>Sign in</li>
                            </ul>
                        </div>
                    </div>
                    <div className="basis-1/4">
                        <p className="mb-[1.6rem] font-semibold text-base text-text-2">Sell</p>

                        <div>
                            <ul className="flex flex-col gap-y-3 text-text-6 text-sm">
                                <li>Sell on Polka</li>
                                <li>Teams</li>
                                <li>Forums</li>
                                <li>Affiliates</li>
                            </ul>
                        </div>
                    </div>
                    <div className="basis-1/4">
                        <p className="mb-[1.6rem] font-semibold text-base text-text-2">About</p>

                        <div>
                            <ul className="flex flex-col gap-y-3 text-text-6 text-sm">
                                <li>Polka, Inc.</li>
                                <li>Policies</li>
                                <li>Investors</li>
                                <li>Careeres</li>
                                <li>Press</li>
                            </ul>
                        </div>
                    </div>
                    <div className="basis-1/4">
                        <p className="mb-[1.6rem] font-semibold text-base text-text-2">Help</p>

                        <div>
                            <ul className="flex flex-col gap-y-3 text-text-6 text-sm">
                                <li>Help Center</li>
                                <li>Trust and safety</li>
                                <li>Privacy settings</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-between py-5 px-1">
                <p>© 2022 Commerce, Inc.</p>

                <div className="flex gap-x-12">
                    <p>Privacy policy</p>
                    <p>Terms of use</p>
                    <p>cookies</p>
                </div>

                <div className="flex gap-x-4">
                    <Button.Root className="group">
                        <Button.Link href="#top" text="Scrol to Top" isActiveLink={false} />
                        <Button.Icon icon={GoArrowUp} className="group-hover:animate-bounce" />
                    </Button.Root>
                </div>
            </div>
        </footer>
    );
}

export default Footer;