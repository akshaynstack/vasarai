import { ModeToggle } from "./theme-toggle";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "@radix-ui/react-navigation-menu";
import { Github } from "lucide-react";

const Header = () => {
    return (
    <header className="container mx-auto p-4">
        <div className="flex justify-between items-center gap-y-2">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink className="text-2xl font-bold text-gradient-custom" href="/">
                  VasarAI
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          <div className="flex items-center gap-x-4">
            <a href='https://github.com/akshaynstack' target='_blank' rel='noopener noreferrer'><Github /></a>
            <ModeToggle />
          </div>
        </div>
      </header>
    )
}

export default Header;
