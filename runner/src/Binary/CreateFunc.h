#include "./Instruction.h"
#include "./LiteralString.h"
#include "../Core/List.h"

namespace Binary
{
  class CreateFunc
  {
  public:
    CreateFunc(char *binary, int offset);
    const int get_end() const;

  private:
    LiteralString *name;
    bool no_args;
    Core::List<CreateFunc *> vars;
    Instruction *returns;
    int end;
  };
}