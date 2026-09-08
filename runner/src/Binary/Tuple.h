#include "./Instruction.h"
#include "./LiteralString.h"
#include "./List.h"

namespace Binary
{
  class Tuple : Instruction
  {
  public:
    Tuple(char *binary, int offset);

    const int get_end() const;

  private:
    List<LiteralString *> names;
    List<Instruction *> values;
    int end;
  };
}