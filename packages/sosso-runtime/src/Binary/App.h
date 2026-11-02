#pragma once

#include "CreateFunc.h"
#include <string>
#include <vector>

namespace Binary {
class App {
  public:
  App(const char* binary);
  ~App();

  std::vector<const CreateFunc*> get_functions() const;
  const CreateFunc* find(std::string name) const;

  private:
  std::vector<const CreateFunc*> functions;
};
}
