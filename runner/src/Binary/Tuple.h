#include "./Instruction.h"
#include "./LiteralString.h"

namespace Binary
{
  class Tuple : Instruction
  {
  public:
    Tuple(char *binary, int offset);

    const int get_end() const;

  private:
    int length;
    LiteralString **names;
    Instruction **values;
    int end;
  };
}