#pragma once

#include <vector>
#include <string>
#include "CreateFunc.h"

namespace Binary
{
  class App
  {
  public:
    App(char *binary);
    ~App();

    CreateFunc *find(std::string name);

  private:
    std::vector<CreateFunc *> functions;
  };
}