#pragma once

#include "Frame.h"
#include "Variable.h"
#include <string>
#include <vector>

namespace Storage {
class Closure {
  public:
  Closure(Frame* globals, std::vector<Frame*> frames);
  ~Closure();

  const Variable* search(std::string name);
  Closure* with_frame(Frame* frame);
  Closure* add_variable(std::string name, const Variable* value);
  const Variable* add_temp_variable(const Variable* value);
  const Variable* search_global(std::string name);

  private:
  Frame* globals;
  std::vector<Frame*> frames;
};
}
