#include "./Instruction.h"
#include "./LiteralString.h"

namespace Binary
{
  class External : Instruction
  {
  public:
    const static int TypeName = 3;
    External(char *binary, int offset);
    const int get_end() const;

  private:
    LiteralString *name;
    int end;
  };
}