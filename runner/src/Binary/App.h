#pragma once

#include "CreateFunc.h"
#include <string>
#include <vector>

namespace Binary {
class App {
  public:
  App(const char* binary);
  ~App();

  CreateFunc* find(std::string name);

  private:
  std::vector<CreateFunc*> functions;
};
}
