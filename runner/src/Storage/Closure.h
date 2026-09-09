#pragma once

#include "Frame.h"
#include "Variable.h"
#include <vector>
#include <string>

namespace Storage
{
  class Closure
  {
  public:
    Closure(Frame *globals, std::vector<Frame *> frames);
    ~Closure();

    Variable *search(std::string name);
    Closure *with_frame(Frame *frame);
    Closure *add_variable(std::string name, Variable *value);
    Variable *search_global(std::string name);

  private:
    Frame *globals;
    std::vector<Frame *> frames;
  };
}