#include "./Instruction.h"
#include "./LiteralString.h"
#include "../Core/List.h"

namespace Binary
{
  class Tuple : Instruction
  {
  public:
    const static int TypeName = 17;
    Tuple(char *binary, int offset);

    const int get_end() const;

  private:
    Core::List<LiteralString *> names;
    Core::List<Instruction *> values;
    int end;
  };
}