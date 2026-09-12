#pragma once

#include "CreateFunc.h"
#include <string>
#include <vector>

namespace Binary {
class App {
  public:
  App(const char* binary);
  ~App();

  const CreateFunc* find(std::string name) const;

  private:
  std::vector<const CreateFunc*> functions;
};
}
