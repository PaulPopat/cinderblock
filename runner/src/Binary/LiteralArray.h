#include "./Instruction.h"
#include "./List.h"

namespace Binary
{
  class LiteralArray : Instruction
  {
  public:
    LiteralArray(char *binary, int offset);

    const int get_end() const;

  private:
    List<Instruction *> values;
    int end;
  };
}