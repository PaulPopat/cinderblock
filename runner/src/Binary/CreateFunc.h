#pragma once

#include "../Storage/Closure.h"
#include "../Storage/Variable.h"
#include "../Storage/VariableTuple.h"
#include "Instruction.h"
#include "LiteralString.h"
#include <vector>

using namespace Storage;

namespace Binary {
class CreateFunc {
  public:
  CreateFunc(const char* binary, int offset);
  ~CreateFunc();
  const int get_end() const;

  std::string get_name() const;
  const Variable* exec(Closure* closure, const VariableTuple* args) const;

  private:
  LiteralString* name;
  bool no_args;
  std::vector<const CreateFunc*> vars;
  Instruction* returns;
  int end;
};
}
