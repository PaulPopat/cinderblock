#pragma once

#include "Instruction.h"
#include "LiteralString.h"
#include <vector>
#include "../Storage/Variable.h"
#include "../Storage/Closure.h"

namespace Binary
{
  class CreateFunc
  {
  public:
    CreateFunc(char *binary, int offset);
    ~CreateFunc();
    const int get_end() const;

    std::string get_name();
    Storage::Variable *exec(Storage::Closure *closure);

  private:
    LiteralString *name;
    bool no_args;
    std::vector<CreateFunc *> vars;
    Instruction *returns;
    int end;
  };
}